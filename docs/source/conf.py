import os
import sys

# Ajouter le chemin du backend au PATH pour les imports
sys.path.insert(0, os.path.abspath('../../backend/src'))

# Informations générales
project = 'WearIT Backend'
copyright = '2024, WearIT Team'
author = 'WearIT Team'

# Extensions Sphinx
extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.autosummary',
    'sphinx.ext.napoleon',
    'sphinx.ext.viewcode'
]

napoleon_google_docstring = True
napoleon_include_init_with_doc = True
napoleon_include_private_with_doc = False
napoleon_include_special_with_doc = False
napoleon_use_param = True
napoleon_use_rtype = True
autosummary_generate = True
templates_path = ['_templates']

# Suffixe des fichiers source
source_suffix = '.rst'

# Thème
html_theme = 'sphinx_rtd_theme'

# Chemin des fichiers statiques
html_static_path = ['_static']
