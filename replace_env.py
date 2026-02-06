import re
from pathlib import Path

root = Path("src")
patterns = [
    # process.env.REACT_APP_X
    (re.compile(r'process\s*\.\s*env\s*\.\s*REACT_APP_BACKEND_URL'), 'import.meta.env.VITE_BACKEND_URL'),
    (re.compile(r'process\s*\.\s*env\s*\.\s*REACT_APP_API_URL'), 'import.meta.env.VITE_API_URL'),
    (re.compile(r'process\s*\.\s*env\s*\.\s*REACT_APP_DEMO_PREMIUM'), 'import.meta.env.VITE_DEMO_PREMIUM'),

    # process.env["REACT_APP_X"] / ['REACT_APP_X']
    (re.compile(r'process\s*\.\s*env\s*\[\s*[\'"]REACT_APP_BACKEND_URL[\'"]\s*\]'), 'import.meta.env.VITE_BACKEND_URL'),
    (re.compile(r'process\s*\.\s*env\s*\[\s*[\'"]REACT_APP_API_URL[\'"]\s*\]'), 'import.meta.env.VITE_API_URL'),
    (re.compile(r'process\s*\.\s*env\s*\[\s*[\'"]REACT_APP_DEMO_PREMIUM[\'"]\s*\]'), 'import.meta.env.VITE_DEMO_PREMIUM'),
]

changed = 0
files = list(root.rglob("*"))
targets = [p for p in files if p.is_file() and p.suffix in {".js",".jsx",".ts",".tsx"}]

for p in targets:
    text = p.read_text(encoding="utf-8", errors="ignore")
    new = text
    for rgx, rep in patterns:
        new = rgx.sub(rep, new)
    if new != text:
        p.write_text(new, encoding="utf-8")
        changed += 1
        print("fixed:", p.as_posix())

print("done. files changed:", changed)
