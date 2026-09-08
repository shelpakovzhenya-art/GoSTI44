#!/usr/bin/env node

import { execFile, spawn } from "node:child_process";
import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const toolsDirectory = path.dirname(fileURLToPath(import.meta.url));
const sourceRoot = path.resolve(toolsDirectory, "..");
const fixturePath = path.join(toolsDirectory, "fixtures/communication-scenarios.json");

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key.startsWith("--") || !value || value.startsWith("--")) throw new Error(`Invalid argument near ${key}`);
    result[key.slice(2)] = value;
    index += 1;
  }
  for (const required of ["baseline", "candidate", "out"]) {
    if (!result[required]) throw new Error(`Missing --${required}`);
  }
  return result;
}

function promptFor(scenario) {
  return [
    "Это read-only проверка пользовательского сообщения Web Kit.",
    "Ничего не меняй, не запускай проверки и не описывай этот eval.",
    "Сформируй только финальный ответ пользователю на основе заданного фактического результата.",
    "Не выдумывай дополнительных работ, файлов и рисков.",
    "Соблюдай автоматически загруженные правила проекта о языке и длине.",
    "",
    `Контекст результата: ${scenario.context}`,
    `Запрос пользователя: ${scenario.request}`,
  ].join("\n");
}

function runCodex(args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn("codex", args, { cwd, env: process.env, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => child.kill("SIGTERM"), 120_000);
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code, signal) => {
      clearTimeout(timer);
      if (code === 0) resolve({ stdout, stderr });
      else reject(Object.assign(new Error(signal ? `Codex terminated by ${signal}` : `Codex exited ${code}`), { stdout, stderr }));
    });
  });
}

function finalMessage(stdout) {
  let result = null;
  for (const line of stdout.split(/\r?\n/)) {
    let event;
    try { event = JSON.parse(line); } catch { continue; }
    if (event.type === "item.completed" && event.item?.type === "agent_message") result = event.item.text;
  }
  if (!result) throw new Error("Codex returned no final agent message");
  return result;
}

function usage(stdout) {
  let result = null;
  for (const line of stdout.split(/\r?\n/)) {
    let event;
    try { event = JSON.parse(line); } catch { continue; }
    if (event.type === "turn.completed" && event.usage) result = event.usage;
  }
  return result;
}

function grade(scenario, message) {
  const withoutCode = message.replace(/`[^`]*`/g, " ").replace(/https?:\/\/\S+/g, " ");
  const words = withoutCode.match(/[\p{L}\p{N}][\p{L}\p{N}_-]*/gu) ?? [];
  const russian = words.filter((word) => /[А-Яа-яЁё]/.test(word)).length;
  const latin = words.filter((word) => /[A-Za-z]/.test(word)).length;
  const bannedEnglishLabel = /^(?:Status|Result|Summary|Next step|Next prompt|Confidence|Scope|Evidence|Checks|Issues|Risks):/m.test(message);
  const internalNoise = /Служебно для Codex|Чтобы продолжить, напишите|Зачем это нужно/.test(message);
  const actionClear = /От вас|действий? от вас|ничего[^.\n]*(?:треб|нуж)|нужно|встав|выбер|можно продолж/i.test(message);
  return {
    words: words.length,
    maxWords: scenario.maxWords,
    russianShare: russian / Math.max(1, russian + latin),
    lengthPass: words.length <= scenario.maxWords,
    languagePass: russian / Math.max(1, russian + latin) >= 0.65 && !bannedEnglishLabel,
    actionPass: actionClear,
    noisePass: !internalNoise,
    pass: words.length <= scenario.maxWords && russian / Math.max(1, russian + latin) >= 0.65 && !bannedEnglishLabel && actionClear && !internalNoise,
  };
}

async function runOne(variant, source, scenario, root) {
  const directory = path.join(root, variant, scenario.id);
  await mkdir(path.dirname(directory), { recursive: true });
  await cp(source, directory, {
    recursive: true,
    force: true,
    preserveTimestamps: true,
    filter: (sourcePath) => {
      const relative = path.relative(source, sourcePath).replaceAll("\\", "/");
      return relative !== ".git" && !relative.startsWith(".git/") &&
        relative !== "dist" && !relative.startsWith("dist/") &&
        relative !== "docs/audits" && !relative.startsWith("docs/audits/");
    },
  });
  await execFileAsync("git", ["init", "-q", "-b", "main"], { cwd: directory });
  const started = Date.now();
  const { stdout, stderr } = await runCodex([
    "exec", "--ephemeral", "--sandbox", "read-only", "--ignore-user-config", "--json",
    "-c", 'model_reasoning_effort="low"', "-C", directory, promptFor(scenario),
  ], sourceRoot);
  const message = finalMessage(stdout);
  return {
    variant,
    scenario: scenario.id,
    durationMs: Date.now() - started,
    usage: usage(stdout),
    message,
    grade: grade(scenario, message),
    stderr: stderr.trim(),
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const fixture = JSON.parse(await readFile(fixturePath, "utf8"));
  const scenarios = options.scenario
    ? fixture.scenarios.filter((scenario) => scenario.id === options.scenario)
    : fixture.scenarios;
  if (!scenarios.length) throw new Error(`Unknown scenario ${options.scenario}`);

  const evaluationRoot = await mkdtemp(path.join(tmpdir(), "web-kit-communication-eval-"));
  const results = [];
  try {
    for (const scenario of scenarios) {
      for (const [variant, source] of [["baseline", path.resolve(options.baseline)], ["candidate", path.resolve(options.candidate)]]) {
        process.stdout.write(`START ${variant} ${scenario.id}\n`);
        try {
          const result = await runOne(variant, source, scenario, evaluationRoot);
          results.push(result);
          process.stdout.write(`DONE ${variant} ${scenario.id} pass=${result.grade.pass} words=${result.grade.words}\n`);
        } catch (error) {
          results.push({ variant, scenario: scenario.id, error: error.message, grade: { pass: false } });
          process.stdout.write(`FAIL ${variant} ${scenario.id}\n`);
        }
      }
    }
    const candidate = results.filter((item) => item.variant === "candidate");
    const baseline = results.filter((item) => item.variant === "baseline");
    const report = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      codexVersion: (await execFileAsync("codex", ["--version"], { encoding: "utf8" })).stdout.trim(),
      summary: {
        candidatePassed: candidate.filter((item) => item.grade.pass).length,
        candidateTotal: candidate.length,
        baselinePassed: baseline.filter((item) => item.grade.pass).length,
        baselineTotal: baseline.length,
        candidateWords: candidate.reduce((sum, item) => sum + (item.grade.words ?? 0), 0),
        baselineWords: baseline.reduce((sum, item) => sum + (item.grade.words ?? 0), 0),
      },
      results,
    };
    const output = path.resolve(options.out);
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
    process.stdout.write(`SUMMARY candidate=${report.summary.candidatePassed}/${report.summary.candidateTotal} baseline=${report.summary.baselinePassed}/${report.summary.baselineTotal}\n`);
    if (report.summary.candidatePassed !== report.summary.candidateTotal) process.exitCode = 1;
  } finally {
    const prefix = path.join(tmpdir(), "web-kit-communication-eval-");
    if (!evaluationRoot.startsWith(prefix)) throw new Error(`Unsafe temp path ${evaluationRoot}`);
    await rm(evaluationRoot, { recursive: true, force: true });
  }
}

await main();
