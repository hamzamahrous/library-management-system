from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the snippet.
        return obj.user == request.user
    

class IsOwnerOnly(permissions.BasePermission):
    """
    Custom permission to allow only the owner of the object to access it at all.
    """

    def has_object_permission(self, request, view, obj):
        # Only allow access if the object's user matches the request user
        return obj.user == request.user