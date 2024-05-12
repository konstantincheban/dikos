""" Main file to create Watcher and watch for the changes in the forecast folder to perform forecasting """
import time
import logging
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from model import forecast
import threading

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

class Watcher:
    """
    Watch for the files in specific folder
    """
    def __init__(self, directoryToWatch):
        self.observer = Observer()
        self.directoryToWatch = directoryToWatch
        logging.info('Watcher was initialized...')

    def run(self):
        """
        Run watcher
        """
        event_handler = Handler()
        self.observer.schedule(event_handler, self.directoryToWatch, recursive=True)
        self.observer.start()
        try:
            while True:
                time.sleep(5)
        except Exception as _e:
            self.observer.stop()
            logging.error("Observer Stopped", exc_info=True)

        self.observer.join()

class Handler(FileSystemEventHandler):
    """
    Handle files create event
    """
    @staticmethod
    def on_created(event):
        """
        Handle multi-threading
        """
        if event.is_directory:
            return None

        # Start a new thread for processing
        threading.Thread(target=processFile, args=(event.src_path,)).start()


def processFile(filePath):
    """
    process only data.json files, which means start of forecasting process
    """
    if 'data.json' in filePath:
        logging.info(f'Handling file: {filePath}')
        forecast(filePath)
        logging.info(f'Done processing {filePath}')

if __name__ == '__main__':
    w = Watcher("/forecast")  # Set your path to the shared volume
    w.run()
