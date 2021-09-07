# from https://stackoverflow.com/questions/57734298/how-can-i-provide-shared-state-to-my-flask-app-with-multiple-workers-without-dep
from multiprocessing import Lock
from multiprocessing.managers import AcquirerProxy, BaseManager, DictProxy

def get_shared_state(host, port, key):
    shared_dict = {}
    shared_lock = Lock()
    manager = BaseManager((host, port), key)
    manager.register("get_dict", lambda: shared_dict, DictProxy)
    manager.register("get_lock", lambda: shared_lock, AcquirerProxy)
    try:
        manager.get_server()
        manager.start()
    except OSError:  # Address already in use
        manager.connect()
    return manager.get_dict(), manager.get_lock()