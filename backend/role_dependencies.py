from fastapi import Depends, HTTPException, status
from models import User, UserRole


def require_role(*roles: UserRole):
    """Dependency to check if user has one of the required roles"""
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"This action requires one of these roles: {', '.join([r.value for r in roles])}"
            )
        return current_user
    return role_checker


def require_bendahara(current_user: User = Depends(get_current_user)):
    """Only bendahara can access this"""
    if current_user.role != UserRole.bendahara:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only bendahara can access this resource"
        )
    return current_user


def require_sekretaris(current_user: User = Depends(get_current_user)):
    """Only sekretaris can access this"""
    if current_user.role != UserRole.sekretaris:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only sekretaris can access this resource"
        )
    return current_user


def require_ketua(current_user: User = Depends(get_current_user)):
    """Only ketua can access this"""
    if current_user.role != UserRole.ketua:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only ketua can access this resource"
        )
    return current_user


# Import at bottom to avoid circular imports
from auth import get_current_user
