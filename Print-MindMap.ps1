# PowerShell script to print the content of folders recursively like a tree
param (
    [string]$path = "."
)

function Get-Tree {
    param (
        [string]$currentPath,
        [string]$indent = ""
    )

    $items = Get-ChildItem -Path $currentPath | Where-Object {$_.Name -ne "node_modules"}

    foreach ($item in $items) {
        Write-Output "$indent`- $($item.Name)"
        if ($item.PSIsContainer) {
            Get-Tree -currentPath $item.FullName -indent "$indent  "
        }
    }
}

# Start with a header for the markdown file
$output = "# Directory Structure`n`n"

# Capture the output of the tree and append to output variable
$output += Get-Tree -currentPath $path | Out-String

# Write the output to mindmap.md
$output | Out-File -FilePath "mindmap.md" -Encoding UTF8

Write-Host "Directory structure written to mindmap.md"
