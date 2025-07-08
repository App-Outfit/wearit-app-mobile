import os
import sys

# Ajouter le chemin du backend au PATH pour les imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend/src')))

# Informations générales
project = 'WearIT Application'
copyright = '2024, WearIT Team'
author = 'WearIT Team'

# Extensions Sphinx
extensions = [
    'sphinx.ext.napoleon',
    'sphinx.ext.viewcode',
    'sphinx.ext.todo',
    'sphinx.ext.coverage',
    'sphinx.ext.ifconfig',
    'sphinx.ext.githubpages',
]

# Configuration des extensions
napoleon_google_docstring = True
napoleon_include_init_with_doc = True
napoleon_include_private_with_doc = False
napoleon_include_special_with_doc = False
napoleon_use_param = True
napoleon_use_rtype = True

# Configuration pour React Native
todo_include_todos = True

templates_path = ['_templates']

# Suffixe des fichiers source
source_suffix = '.rst'

# Thème
html_theme = 'sphinx_rtd_theme'

# Configuration du thème
html_theme_options = {
    'navigation_depth': 4,
    'titles_only': False,
    'collapse_navigation': False,
    'sticky_navigation': True,
    'includehidden': True,
}

# Chemin des fichiers statiques
html_static_path = ['_static']

# Configuration pour la génération de documentation
html_show_sourcelink = True
html_show_sphinx = True
html_show_copyright = True

# Configuration pour les fichiers de sortie
html_file_suffix = None
html_split_index = False
html_sidebars = {
    '**': [
        'globaltoc.html',
        'relations.html',
        'sourcelink.html',
        'searchbox.html',
    ]
}
