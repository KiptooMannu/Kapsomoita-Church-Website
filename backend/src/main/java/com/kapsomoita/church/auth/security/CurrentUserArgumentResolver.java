package com.kapsomoita.church.auth.security;

import com.kapsomoita.church.auth.domain.User;
import com.kapsomoita.church.common.web.ActorResolver;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * Resolves {@link CurrentUser}-annotated controller parameters to the current
 * authenticated {@link User} entity.
 *
 * <p>The JWT filter puts a {@link SecurityUser} into the SecurityContext. This
 * resolver uses {@link ActorResolver} to convert that lightweight principal into
 * a fully managed JPA entity so audit entries can hold a valid FK reference.
 *
 * <p>For anonymous requests the resolved value is {@code null}; controllers that
 * require authentication should rely on {@code @PreAuthorize} (or security config)
 * to reject unauthenticated requests before this resolver fires.
 */
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {

    private final ActorResolver actorResolver;

    public CurrentUserArgumentResolver(ActorResolver actorResolver) {
        this.actorResolver = actorResolver;
    }

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentUser.class)
                && User.class.isAssignableFrom(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof SecurityUser principal)) {
            return null;
        }
        return actorResolver.resolve(principal);
    }
}
