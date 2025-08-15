$baseDirectory = ".\src"

# Get all HTML files excluding the footer.html file itself
$htmlFiles = Get-ChildItem -Path $baseDirectory -Include "*.html" -Recurse -Exclude "footer.html"

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Skip files that already have the footer placeholder
    if ($content -match '<div id="footer-placeholder"></div>') {
        Write-Host "Skipping $($file.FullName) - footer placeholder already exists."
        continue
    }
    
    # Check if the file has a footer section
    if ($content -match '<!-- Footer -->[\s\S]*?<footer id="footer">[\s\S]*?</footer>') {
        # Replace the footer with placeholder
        $newContent = $content -replace '<!-- Footer -->[\s\S]*?<footer id="footer">[\s\S]*?</footer>', '<!-- Footer placeholder -->
        <div id="footer-placeholder"></div>'
        
        # Now check if include.js is already included
        if (-not ($newContent -match 'include\.js')) {
            # Add include.js script reference before the </body> tag
            # First determine the path depth for proper relative paths
            $relPath = ""
            $depth = ($file.FullName -split "\\src\\")[1].Split("\").Length - 1
            
            if ($depth -eq 0) {
                $relPath = "assets/js/include.js"
            } else {
                for ($i = 0; $i -lt $depth; $i++) {
                    $relPath += "../"
                }
                $relPath += "assets/js/include.js"
            }
            
            $newContent = $newContent -replace '<script src="([^"]*main\.js)"></script>\s*</body>', "<script src=`"`$1`"></script>`n        <script src=`"$relPath`"></script>`n    </body>"
        }
        
        # Write the updated content back to the file
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Updated $($file.FullName)"
    } else {
        Write-Host "Skipping $($file.FullName) - no footer found."
    }
}

Write-Host "Footer replacement complete!"
