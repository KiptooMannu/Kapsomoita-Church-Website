package com.kapsomoita.church.auth.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Injects the currently authenticated {@link com.kapsomoita.church.auth.domain.User}
 * entity into a controller method parameter.
 *
 * <p>The annotation is resolved by {@link CurrentUserArgumentResolver}, which
 * loads the full entity from the database once per request so audit entries
 * have a valid managed reference to work with.
 *
 * <p>If the request is anonymous the resolved value is {@code null}; annotated
 * parameters must therefore be declared as {@code User} (not a primitive) so
 * Spring can inject null safely.
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface CurrentUser {
}
