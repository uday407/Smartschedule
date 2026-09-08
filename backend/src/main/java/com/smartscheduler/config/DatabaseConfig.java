package com.smartscheduler.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url:jdbc:h2:mem:smartscheduler_db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE}")
    private String dbUrl;

    @Value("${spring.datasource.username:sa}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        DataSourceBuilder<?> builder = DataSourceBuilder.create();
        builder.url(dbUrl);
        builder.username(username);
        builder.password(password);

        if (dbUrl != null && dbUrl.startsWith("jdbc:postgresql")) {
            builder.driverClassName("org.postgresql.Driver");
        } else {
            builder.driverClassName("org.h2.Driver");
        }

        return builder.build();
    }
}
