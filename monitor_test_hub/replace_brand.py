import os

count = 0
files_updated = 0

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.astro', '.ts', '.tsx', '.js', '.json', '.md')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content.replace('Monitor Test Hub', 'Display Test Online')
            new_content = new_content.replace('monitor test hub', 'display test online')
            new_content = new_content.replace('MONITOR TEST HUB', 'DISPLAY TEST ONLINE')
            
            if new_content != content:
                files_updated += 1
                c = content.count('Monitor Test Hub') + content.count('monitor test hub') + content.count('MONITOR TEST HUB')
                count += c
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)

print(f'Updated {files_updated} files with {count} replacements.')
