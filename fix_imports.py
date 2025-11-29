import os
import re

def fix_imports(directory):
    # Regex to find imports with version numbers: from "package@1.2.3"
    # We want to capture "package" and ignore "@..."
    # Pattern: from "(@?[a-zA-Z0-9\-/]+)@[^"]+"
    pattern = re.compile(r'from "(@?[a-zA-Z0-9\-/]+)@[^"]+"')
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".tsx") or file.endswith(".ts"):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = pattern.sub(r'from "\1"', content)
                
                if new_content != content:
                    print(f"Fixing {file}...")
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)

if __name__ == "__main__":
    fix_imports("/Users/ishiikentaro/development/20251122/src/components/ui")
