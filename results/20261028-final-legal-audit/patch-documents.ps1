$ErrorActionPreference = 'Stop'
$OutputEncoding = [Console]::OutputEncoding = [Text.UTF8Encoding]::new()
Add-Type -AssemblyName System.IO.Compression.FileSystem
$taskRoot = $PSScriptRoot
$outRoot = Join-Path $taskRoot '.work/documents'
New-Item -ItemType Directory -Path $outRoot -Force | Out-Null
$jobs = @(
  @{ Source='согласие на обработку.docx'; Output='soglasie-na-obrabotku-personalnyh-dannyh.docx'; Changes=@(
    @{Part='word/document.xml'; Before='Яколвеву'; After='Яковлеву'}
  )},
  @{ Source='правила проживания.docx'; Output='pravila-prozhivaniya.docx'; Changes=@(
    @{Part='word/document.xml'; Before='Парковка, баня, купель и мангал'; After='Парковка, баня и мангал'},
    @{Part='word/document.xml'; Before='Пользование баней и купелью необходимо согласовать заранее; возможность зависит от их доступности и занятости. Услуги оплачиваются отдельно.'; After='Пользование баней необходимо согласовать заранее; возможность зависит от её доступности и занятости. Баня оплачивается отдельно.'}
  )},
  @{ Source='договор офферты.docx'; Output='dogovor-oferta.docx'; Changes=@(
    @{Part='word/document.xml'; Before='Контактные данные указаны в разделе 15.'; After='Контактные данные опубликованы на сайте tangerin.ru.'},
    @{Part='word/footer1.xml'; Before='tangerine.ru'; After='tangerin.ru'}
  )}
)
foreach ($job in $jobs) {
  $sourcePath = Join-Path 'C:/Users/della/Downloads' $job.Source
  $outputPath = Join-Path $outRoot $job.Output
  $inputZip = [IO.Compression.ZipFile]::OpenRead($sourcePath)
  $stream = [IO.File]::Open($outputPath, [IO.FileMode]::Create)
  $outputZip = [IO.Compression.ZipArchive]::new($stream, [IO.Compression.ZipArchiveMode]::Create)
  try {
    foreach ($entry in $inputZip.Entries) {
      $copy = $outputZip.CreateEntry($entry.FullName, [IO.Compression.CompressionLevel]::Optimal)
      $copy.LastWriteTime = $entry.LastWriteTime
      $sourceStream = $entry.Open()
      $targetStream = $copy.Open()
      try {
        $edits = @($job.Changes | Where-Object { $_.Part -eq $entry.FullName })
        if ($edits.Count -eq 0) { $sourceStream.CopyTo($targetStream); continue }
        $doc = [Xml.XmlDocument]::new(); $doc.PreserveWhitespace = $true; $doc.XmlResolver = $null
        $doc.Load($sourceStream)
        $ns = [Xml.XmlNamespaceManager]::new($doc.NameTable)
        $ns.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
        foreach ($edit in $edits) {
          $matches = @($doc.SelectNodes('//w:t', $ns) | Where-Object { $_.InnerText.Contains($edit.Before) })
          if ($matches.Count -ne 1) { throw "Expected exactly one text run in $($job.Source): $($edit.Before)" }
          $matches[0].InnerText = $matches[0].InnerText.Replace($edit.Before, $edit.After)
        }
        $settings = [Xml.XmlWriterSettings]::new(); $settings.Encoding = [Text.UTF8Encoding]::new($false); $settings.Indent = $false
        $writer = [Xml.XmlWriter]::Create($targetStream, $settings)
        try { $doc.Save($writer); $writer.Flush() } finally { $writer.Dispose() }
      } finally { $sourceStream.Dispose(); $targetStream.Dispose() }
    }
  } finally { $outputZip.Dispose(); $stream.Dispose(); $inputZip.Dispose() }
  Write-Output "Prepared $($job.Output)"
}
