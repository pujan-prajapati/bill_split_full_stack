from activity.models import Activity


class ActivityService:
    @staticmethod
    def log(group, user, action, description):
        Activity.objects.create(
            group=group, user=user, action=action, description=description
        )
