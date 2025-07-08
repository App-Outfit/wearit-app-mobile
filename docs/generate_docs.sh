#!/bin/bash

# Script de génération de documentation pour WearIT
# Usage: ./generate_docs.sh [clean|html|pdf|serve]

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  WearIT Documentation Builder${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Vérification des prérequis
check_prerequisites() {
    print_message "Vérification des prérequis..."
    
    if ! command -v python3 &> /dev/null; then
        print_error "Python3 n'est pas installé"
        exit 1
    fi
    
    if ! command -v pip &> /dev/null; then
        print_error "pip n'est pas installé"
        exit 1
    fi
    
    print_message "Prérequis vérifiés ✓"
}

# Installation des dépendances
install_dependencies() {
    print_message "Installation des dépendances..."
    
    if [ -f "requirements.txt" ]; then
        pip install -r requirements.txt
        print_message "Dépendances installées ✓"
    else
        print_warning "Fichier requirements.txt non trouvé"
    fi
}

# Nettoyage de la documentation
clean_docs() {
    print_message "Nettoyage de la documentation..."
    make clean
    print_message "Documentation nettoyée ✓"
}

# Génération de la documentation HTML
generate_html() {
    print_message "Génération de la documentation HTML..."
    make html
    print_message "Documentation HTML générée ✓"
}

# Génération de la documentation PDF
generate_pdf() {
    print_message "Génération de la documentation PDF..."
    
    if command -v pdflatex &> /dev/null; then
        make latexpdf
        print_message "Documentation PDF générée ✓"
    else
        print_error "pdflatex n'est pas installé. Impossible de générer le PDF."
        print_message "Installez LaTeX pour générer des PDFs."
        exit 1
    fi
}

# Serveur de développement
serve_docs() {
    print_message "Démarrage du serveur de développement..."
    
    if [ -d "build/html" ]; then
        print_message "Documentation disponible sur http://localhost:8000"
        print_message "Appuyez sur Ctrl+C pour arrêter le serveur"
        python3 -m http.server 8000 --directory build/html
    else
        print_error "La documentation HTML n'existe pas. Générez-la d'abord avec './generate_docs.sh html'"
        exit 1
    fi
}

# Affichage de l'aide
show_help() {
    echo "Usage: $0 [COMMANDE]"
    echo ""
    echo "Commandes disponibles:"
    echo "  clean   - Nettoie la documentation générée"
    echo "  html    - Génère la documentation HTML"
    echo "  pdf     - Génère la documentation PDF (nécessite LaTeX)"
    echo "  serve   - Démarre un serveur local pour consulter la documentation"
    echo "  all     - Nettoie, génère HTML et PDF"
    echo "  help    - Affiche cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 html     # Génère la documentation HTML"
    echo "  $0 serve    # Démarre le serveur de développement"
    echo "  $0 all      # Génère tout (HTML + PDF)"
}

# Fonction principale
main() {
    print_header
    
    # Vérification des prérequis
    check_prerequisites
    
    # Installation des dépendances si nécessaire
    if [ ! -d "build" ]; then
        install_dependencies
    fi
    
    # Traitement des commandes
    case "${1:-help}" in
        "clean")
            clean_docs
            ;;
        "html")
            generate_html
            ;;
        "pdf")
            generate_pdf
            ;;
        "serve")
            serve_docs
            ;;
        "all")
            clean_docs
            generate_html
            generate_pdf
            print_message "Documentation complète générée ✓"
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Exécution du script
main "$@" 