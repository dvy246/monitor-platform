import glob
import os

all_files = sorted(glob.glob('src/pages/**/*.astro', recursive=True))

fixed = 0
for filepath in all_files:
    if '[locale]' in filepath:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        if 'import BasePage' in content:
            lines = content.split('\n')
            import_line = None
            other_lines = []
            for l in lines:
                if l.strip().startswith('import BasePage'):
                    import_line = l
                else:
                    other_lines.append(l)

            if import_line and other_lines[0].strip() == '---':
                new_lines = ['---', import_line] + other_lines[1:]
                new_content = '\n'.join(new_lines)
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    fixed += 1

print(f"Total localized alias templates fixed: {fixed}")

