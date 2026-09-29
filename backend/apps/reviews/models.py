from django.db import models


class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    avatar_url = models.URLField(blank=True)
    quote = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', '-id']

    def __str__(self):
        return self.name
