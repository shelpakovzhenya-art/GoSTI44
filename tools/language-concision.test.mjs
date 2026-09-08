import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const toolsDirectory = path.dirname(fileURLToPath(import.meta.url));
const sourceRoot = path.resolve(toolsDirectory, "..");
const outputContract = "Пиши человекочитаемый артефакт и сообщение по-русски и кратко.";

async function read(relative) {
  return readFile(path.join(sourceRoot, ...relative.split("/")), "utf8");
}

async function walk(relativeDirectory) {
  const absolute = path.join(sourceRoot, ...relativeDirectory.split("/"));
  const entries = await readdir(absolute, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const relative = `${relativeDirectory}/${entry.name}`;
    if (entry.isDirectory()) result.push(...(await walk(relative)));
    else if (entry.isFile() && entry.name.endsWith(".md")) result.push(relative);
  }
  return result.sort((left, right) => left.localeCompare(right, "en"));
}

function bytes(value) {
  return Buffer.byteLength(value, "utf8");
}

function extractManagedBlock(agents) {
  const start = agents.indexOf("<!-- PROMPT_KIT:BEGIN");
  const marker = "<!-- PROMPT_KIT:END -->";
  const end = agents.indexOf(marker);
  assert.ok(start >= 0 && end > start);
  return agents.slice(start, end + marker.length);
}

function outputLines(content) {
  const result = [];
  let inside = false;
  let fenced = false;
  for (const line of content.split("\n")) {
    if (!fenced && line === "## Output") {
      inside = true;
      continue;
    }
    if (!fenced && inside && line === "## Done when") {
      inside = false;
      continue;
    }
    if (line.startsWith("```")) fenced = !fenced;
    if (inside) result.push(line);
  }
  return result;
}

const bannedTitles = new Set([
  "Sitemap", "Page Section Map", "Content Inventory", "IA Review", "Reference Principles",
  "Design Hypothesis Queue", "Design Concept Feedback", "Approved Design Concept", "Design Tokens",
  "Layout and Responsive Rules", "Component Inventory", "Accessibility Rules", "Design System Review",
  "Next.js Preflight", "Next.js Scaffold", "Next.js Technical Architecture", "App Router Structure",
  "Styling and Design System Integration", "Tooling and Quality Scripts", "Next Ready Review", "Page Scope",
  "Reference Adaptation", "Content and SEO Plan", "Block Breakdown", "Page Planning Review",
  "Block Content Preview", "Fast Block Build", "gpt-taste Creative Build", "Block Build Plan",
  "Block Build Review", "Smoke Check", "Quality Plan", "Visual Review",
  "Accessibility and Usability Check", "Technical Checks", "Browser Runtime Verification", "Quality Summary",
  "Application Flow Check", "Handoff Scope", "Final Review", "Change Summary", "Next Iteration Plan",
  "Product Data Model", "Catalog Architecture", "Category / PLP Spec", "Product Card Spec",
  "Filters, Search and Sorting", "Commercial Rules", "Cart Spec", "Account, Orders and Analytics",
  "Commerce Operations and Payment Safety", "Ecommerce Review", "Deployment Brief", "Server Access",
  "Server Security", "Runtime and Hosting Strategy", "Production Env and Secrets", "Domain, DNS and SSL",
  "Deploy Runbook", "Process Manager and Reverse Proxy", "Post-deploy Checks",
  "Monitoring, Backup and Rollback", "Deployment Handoff", "Pre-deploy Technical SEO",
  "Production SEO Verification", "Prompt Kit Update Summary", "Prompt Kit Integrity",
  "AGENTS.md Migration", "Prompt Kit Workflow Alignment", "Prompt Kit Release Preflight",
]);

const bannedFields = new Set([
  "Status", "Result", "Results", "Verdict", "Confidence", "Open questions", "Next prompt", "Next step",
  "Issues", "Risks", "Source", "Evidence", "Checks", "Why", "Owner prompt", "User question",
  "Business goal", "Content needed", "Required user actions", "Changed files", "Project state update",
]);

const allowedTechnicalLabels = new Set([
  "1440 CSS px", "1920 CSS px", "2560 CSS px", "B2C/B2B", "Browser/runtime",
  "CMS", "CRM/ERP", "CSS viewport", "CSS viewport / DPR", "CTA", "Canonical",
  "Canonical/robots", "Checkout", "Description", "Done when", "Email/SMS", "Firewall",
  "Follow-up", "GitHub App", "H1", "Layout", "Lint", "Mobile", "Mobile / 1440 / 2560",
  "Next.js", "OG", "OG/share", "Open Graph", "Output", "PDP", "Reduced motion",
  "Reverse proxy", "Rich Results Test", "Robots", "Robots/meta", "SHA-256 skill", "SKU",
  "SSH", "SSL", "Seed", "Sudo", "Title", "Title/description", "TypeScript", "URL",
  "Visual North Star", "add_payment_info", "add_shipping_info", "begin_checkout",
  "checkout_error", "purchase",
]);

function untranslatedHumanLabel(value) {
  return /[A-Za-z]/.test(value) && !/[А-Яа-яЁё]/.test(value) && !allowedTechnicalLabels.has(value);
}

function isTableSeparator(line) {
  return /^\s*\|(?:\s*:?-+:?\s*\|)+\s*$/.test(line);
}

test("managed instructions and human-facing references stay within the 0.11 budgets", async () => {
  const [agents, router, state, response] = await Promise.all([
    read("AGENTS.md"), read("prompts/ROUTER.md"), read("prompts/STATE.md"),
    read("prompts/_knowledge/codex-user-response-quality.md"),
  ]);
  assert.ok(bytes(extractManagedBlock(agents)) <= 10_240);
  assert.ok(bytes(router) <= 16_384);
  assert.ok(bytes(state) <= 6_144);
  assert.ok(bytes(response) <= 7_168);
  const scaffold = state.match(/```md\n([\s\S]*?)\n```/)?.[1] ?? "";
  assert.ok(scaffold && bytes(scaffold) <= 4_096);
});

test("all 101 output contracts require concise Russian human-facing artifacts", async () => {
  const files = await walk("prompts");
  let sections = 0;
  let contracts = 0;
  const titleViolations = [];
  const fieldViolations = [];
  const untranslatedViolations = [];

  for (const relative of files) {
    const content = await read(relative);
    sections += (content.match(/^## Output$/gm) ?? []).length;
    contracts += (content.match(new RegExp(`^${outputContract.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "gm")) ?? []).length;
    const lines = outputLines(content);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const heading = line.match(/^#{1,5}\s+([^:]+?)(?::|$)/)?.[1]?.trim();
      if (heading && bannedTitles.has(heading)) titleViolations.push(`${relative}: ${heading}`);
      if (heading && untranslatedHumanLabel(heading)) untranslatedViolations.push(`${relative}: ${heading}`);
      const field = line.match(/^\s*[-*]\s+([^`:]+):/)?.[1]?.trim();
      if (field && bannedFields.has(field)) fieldViolations.push(`${relative}: ${field}`);
      if (field && untranslatedHumanLabel(field)) untranslatedViolations.push(`${relative}: ${field}`);
      if (/^\s*\|/.test(line) && isTableSeparator(lines[index + 1] ?? "")) {
        for (const cell of line.split("|").slice(1, -1).map((value) => value.trim())) {
          if (bannedFields.has(cell)) fieldViolations.push(`${relative}: ${cell}`);
          if (untranslatedHumanLabel(cell)) untranslatedViolations.push(`${relative}: ${cell}`);
        }
      }
    }
  }

  assert.equal(sections, 101);
  assert.equal(contracts, sections);
  assert.deepEqual(titleViolations, []);
  assert.deepEqual(fieldViolations, []);
  assert.deepEqual(untranslatedViolations, []);
});

test("project templates use Russian labels and no longer force a verbose final block", async () => {
  const templates = await walk("prompts/_templates");
  const violations = [];
  for (const relative of templates) {
    const content = await read(relative);
    const lines = content.split("\n");
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const label = line.match(/^\s*[-*]\s+([^`:]+):/)?.[1]?.trim();
      const heading = line.match(/^#{1,5}\s+(.+)$/)?.[1]?.trim();
      if (label && bannedFields.has(label)) violations.push(`${relative}: ${label}`);
      if (heading && bannedTitles.has(heading)) violations.push(`${relative}: ${heading}`);
      if (label && untranslatedHumanLabel(label)) violations.push(`${relative}: ${label}`);
      if (heading && untranslatedHumanLabel(heading)) violations.push(`${relative}: ${heading}`);
      if (/^\s*\|/.test(line) && isTableSeparator(lines[index + 1] ?? "")) {
        for (const cell of line.split("|").slice(1, -1).map((value) => value.trim())) {
          if (untranslatedHumanLabel(cell)) violations.push(`${relative}: ${cell}`);
        }
      }
    }
  }
  assert.deepEqual(violations, []);

  const [agents, promptTemplate, response] = await Promise.all([
    read("AGENTS.md"), read("prompts/_templates/prompt-template.md"),
    read("prompts/_knowledge/codex-user-response-quality.md"),
  ]);
  for (const source of [agents, promptTemplate, response]) {
    assert.ok(!source.includes("Чтобы продолжить, напишите"));
    assert.ok(!source.includes("Служебно для Codex"));
    assert.ok(!source.includes("Зачем это нужно"));
  }
  assert.ok(agents.includes("по умолчанию пиши по-русски"));
  assert.ok(agents.includes("обычно достаточно `120` слов"));
  assert.ok(response.includes("человекочитаемых Markdown-документов"));
});

test("project-state is Russian, replace-only and protected by lossless history", async () => {
  const state = await read("prompts/STATE.md");
  for (const forbidden of ["# Project State", "## Current snapshot", "## Latest completed result", "- Stage:", "- Confidence:"]) {
    assert.ok(!state.includes(forbidden), `legacy state label remains: ${forbidden}`);
  }
  assert.ok(state.includes("не более `4096` байт"));
  assert.ok(state.includes("без потерь добавь прежний текст в `docs/project-history.md`"));
  assert.ok(state.includes("Не дописывай в снимок завершённые задачи"));
});

test("communication evaluation fixture covers six agreed scenarios", async () => {
  const fixture = JSON.parse(await read("tools/fixtures/communication-scenarios.json"));
  assert.equal(fixture.schemaVersion, 1);
  assert.deepEqual(fixture.scenarios.map((item) => item.id), [
    "status", "direct", "cms", "secret", "quality", "release",
  ]);
  assert.equal(fixture.scenarios.length, 6);
  for (const scenario of fixture.scenarios) {
    assert.ok(scenario.request && scenario.context && scenario.maxWords);
  }
});
