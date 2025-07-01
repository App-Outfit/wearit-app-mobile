import logging
import sys

def setup_logger():
    logger = logging.getLogger("app")
    logger.setLevel(logging.DEBUG)  # ✅ Change à `INFO` ou `ERROR` en prod

    # formatter = logging.Formatter(
    #     "[%(asctime)s] [%(levelname)s] [%(module)s] - %(message)s",
    #     datefmt="%Y-%m-%d %H:%M:%S"
    # )

    # ✅ Log dans la console
    console_handler = logging.StreamHandler(sys.stdout)
    #console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # ✅ Log dans un fichier 
    # file_handler = logging.FileHandler("logs/app.log")
    # file_handler.setFormatter(formatter)
    # logger.addHandler(file_handler)

    return logger

logger = setup_logger()