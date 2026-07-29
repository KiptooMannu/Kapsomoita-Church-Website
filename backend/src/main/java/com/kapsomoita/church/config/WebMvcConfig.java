package com.kapsomoita.church.config;

import com.kapsomoita.church.auth.security.CurrentUserArgumentResolver;
import com.kapsomoita.church.common.web.ActorResolver;
import java.util.List;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Registers custom Spring MVC argument resolvers.
 *
 * <p>Currently registers {@link CurrentUserArgumentResolver} so that
 * {@code @CurrentUser User actor} parameters in controllers are resolved
 * to the authenticated user's JPA entity automatically.
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final ActorResolver actorResolver;

    public WebMvcConfig(ActorResolver actorResolver) {
        this.actorResolver = actorResolver;
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new CurrentUserArgumentResolver(actorResolver));
    }
}
