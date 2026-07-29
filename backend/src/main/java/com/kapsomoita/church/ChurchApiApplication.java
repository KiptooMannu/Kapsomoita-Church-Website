package com.kapsomoita.church;

import com.kapsomoita.church.config.AppProperties;
import com.kapsomoita.church.config.CloudinaryProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;


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

