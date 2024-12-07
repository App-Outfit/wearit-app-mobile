# Configuration file for the Sphinx documentation builder.

# -- Project information -----------------------------------------------------
project = 'WearIT'
copyright = '2024, Charles-André Arsenec, Théo Bonzi'
author = 'Charles-André Arsenec, Théo Bonzi'

# -- General configuration ---------------------------------------------------
extensions = ['myst_parser']

# Support des fichiers Markdown et reStructuredText
source_suffix = {
    '.rst': 'restructuredtext',
    '.md': 'markdown',
}

# Chemin vers le répertoire source de vos fichiers TypeScript
js_source_path = '../../src'

templates_path = ['_templates']
exclude_patterns = []

# -- Options for HTML output -------------------------------------------------
html_theme = 'sphinx_rtd_theme'
html_static_path = ['_static']
