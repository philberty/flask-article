#!/usr/bin/env python

import os
import datetime
import platform

import psutil

from flask import Flask
from flask import jsonify
from flask import request

sfolder = os.path.join(os.path.dirname(os.path.abspath (__file__)), 'www')
app = Flask(__name__, static_folder=sfolder)

@app.route("/")
def index():
    return app.send_static_file('index.html')

@app.route("/<path:path>")
def statics(path):
    return app.send_static_file(path)

@app.route("/api/hostinfo")
def getHostInfo():
    return jsonify(
        {
            'Platform': platform.platform(),
            'hostname': platform.node(),
            'machine': platform.machine(),
            'version': platform.version(),
            'cores': psutil.cpu_count(),
            'usage': psutil.cpu_times_percent().user,
            'memory_total': psutil.virtual_memory().total,
            'memory_used': psutil.virtual_memory().used,
            'disk_total': psutil.disk_usage('/').total,
            'disk_free': psutil.disk_usage('/').used,
            'timestamp': datetime.datetime.now().isoformat(),
            'process': len(psutil.pids())
        }
    )

@app.route("/api/hoststats")
def getHostStats():
    return jsonify(
        {
            'total_usage': psutil.cpu_percent(percpu=False),
            'cpu_usages': psutil.cpu_percent(percpu=True),
            'memory_total': psutil.virtual_memory().total,
            'memory_used': psutil.virtual_memory().used,
            'timestamp': datetime.datetime.now().isoformat()
        }
    )

@app.route("/api/hostpids")
def getProcessList():
    pids = []
    for i in psutil.process_iter():
        pids.append(i.as_dict(attrs=['name', 'pid', 'username', 'num_threads']))
    return jsonify({'pids': pids})

@app.route("/api/process/<path:pid>")
def getProcessStats(pid):
    return jsonify(None)

if __name__ == '__main__':
    app.run(debug=True)
