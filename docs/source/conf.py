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

autosummary_generate = True

# Chemin des templates
templates_path = ['_templates']

# Suffixe des fichiers source
source_suffix = '.rst'

# Thème
html_theme = 'sphinx_rtd_theme'

# Chemin des fichiers statiques
html_static_path = ['_static']
