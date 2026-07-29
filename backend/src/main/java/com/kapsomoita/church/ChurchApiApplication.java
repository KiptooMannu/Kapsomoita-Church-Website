package com.kapsomoita.church;

import com.kapsomoita.church.config.AppProperties;
import com.kapsomoita.church.config.CloudinaryProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Entry point for the Kapsomoita Church Management Platform API.
 *
 * <p>JPA auditing populates {@code createdAt}/{@code updatedAt} on entities that
 * extend {@code BaseEntity}. Async is enabled so email notifications never block
 * a request thread, and scheduling drives housekeeping such as pruning expired
 * refresh tokens.
 */
@SpringBootApplication
@EnableConfigurationProperties({AppProperties.class, CloudinaryProperties.class})
@EnableJpaAuditing
@EnableAsync
@EnableScheduling
public class ChurchApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChurchApiApplication.class, args);
    }
}

