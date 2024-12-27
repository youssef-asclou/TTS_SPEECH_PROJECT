import json
from django.db import models

class MyModel(models.Model):
    data = models.TextField()

    def set_data(self, x):
        self.data = json.dumps(x)

    def get_data(self):
        return json.loads(self.data)
