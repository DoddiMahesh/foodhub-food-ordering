from django.db.models.signals import pre_delete,pre_save
from django.dispatch import receiver
from .models import Restaurant

@receiver(pre_delete,sender=Restaurant)
def delete_restaurant_image_on_delete(sender,instance, **kwargs):
    if instance.image:
        instance.image.delete(save=False)

@receiver(pre_save,sender=Restaurant)
def delete_old_restaurant_image_on_update(sender,instance, **kwargs):
    if not instance.pk:
        return
    try:
        old_instance=Restaurant.objects.get(pk=instance.pk)
    except Restaurant.DoesNotExist:
        return
    if old_instance.image and old_instance.image != instance.image:
        old_instance.image.delete(save=False)
        