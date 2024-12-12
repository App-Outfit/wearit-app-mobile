# 📚 WearIT Backend Documentation Guide

This guide explains how to generate and view the documentation for the WearIT backend project locally. It also covers best practices for writing docstrings using the **Google Style** and explains their importance.

---

## 🛠️ Prerequisites

Ensure you have the following installed:

- **Python** (version 3.8 or higher)
- **Sphinx** and necessary extensions

### Install Dependencies

Install the required dependencies using `requirements.txt`:

```bash
pip install -r requirements.txt
```

---

## 🚀 Generating and Viewing the Documentation Locally

### 1. Navigate to the Documentation Directory

```bash
cd docs
```

### 2. Clean Previous Builds

```bash
make clean
```

### 3. Generate the HTML Documentation

```bash
make html
```

### 4. View the Documentation

Open the generated `index.html` in your browser:

```bash
# Linux
xdg-open build/html/index.html

# Firefox
firefox build/html/index.html

# macOS
open build/html/index.html

# Windows
start build\html\index.html
```

---

## 📝 Adding New Files or Functions to the Documentation

When you add new files or functions to the project, you need to regenerate the `.rst` files so that they are included in the documentation.

#### Example `requirements.txt`

```txt
sphinx>=4.0
sphinx_rtd_theme
```
### Generate `.rst` Files for New Modules or Functions

Navigate to the `docs` directory and run the following command to regenerate the `.rst` files for your source code:

```bash
sphinx-apidoc -f -o source ../backend/src
```

- **`-f`**: Forces the overwriting of existing `.rst` files.
- **`-o source`**: Specifies the output directory for the generated `.rst` files.
- **`../../backend/src`**: Path to the source code directory.

### Rebuild the Documentation

After generating the `.rst` files, clean and rebuild the documentation:

```bash
make clean
make html
```

---

## 🖋️ Writing Docstrings

### Why Use Docstrings?

Docstrings are essential for:

- **Code Clarity**: They explain what a function, class, or module does.
- **Automatic Documentation**: Tools like **Sphinx** generate documentation from docstrings.
- **Maintainability**: They help developers understand and maintain the codebase.

### Google Style Docstrings

The WearIT backend uses the **Google Style** for docstrings.

#### Example Docstring

```python
def create_user(name: str, email: str, password: str) -> str:
    """Create a new user in the database and return an access token.

    Args:
        name (str): The name of the user.
        email (str): The email address of the user.
        password (str): The plaintext password of the user.

    Raises:
        HTTPException: If the user already exists.

    Returns:
        str: A JWT access token for the newly created user.
    """
    return "token"
```

### Docstring Sections

1. **Summary**: A one-line description of the function.
2. **Args**: Describes the parameters, including their types.
3. **Raises**: Lists exceptions the function might raise.
4. **Returns**: Describes the return value and its type.

---

## 📂 Directory Structure

```
wearit-app-mobile/
│-- docs/
│   ├── source/
│   │   ├── conf.py
│   │   ├── index.rst
│   │   └── _templates/
│   ├── Makefile
│   ├── make.bat
│   ├── requirements.txt
│   └── README.md
```

---

## 🔄 Useful Commands

- **Clean the Build**:

  ```bash
  make clean
  ```

- **Generate HTML Documentation**:

  ```bash
  make html
  ```

- **Generate PDF Documentation** (requires `latex`):

  ```bash
  make latexpdf
  ```

---

## 🕵️‍♂️ Troubleshooting

- **Module Import Errors**:  
  Ensure the path in `conf.py` is correct:

  ```python
  import os
  import sys
  sys.path.insert(0, os.path.abspath('../../backend/src'))
  ```

- **Missing Dependencies**:  
  Install the dependencies listed in `requirements.txt`:

  ```bash
  pip install -r requirements.txt
  ```

- **Permission Issues**:  
  Ensure all necessary files and folders have the correct permissions:

  ```bash
  chmod -R 755 backend/src
  ```

---

## 📚 Additional Resources

- [Sphinx Documentation](https://www.sphinx-doc.org/en/master/)
- [Google Style Guide for Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)
- [Read the Docs Guide](https://docs.readthedocs.io/en/stable/)

---