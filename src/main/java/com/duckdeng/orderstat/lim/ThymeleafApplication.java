package com.duckdeng.orderstat.lim;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.*;
import java.util.List;
import java.util.Objects;

@SpringBootApplication
public class ThymeleafApplication {
    public static void main(String[] args) throws IOException {
        ClassLoader classLoader = ThymeleafApplication.class.getClassLoader();

        File file = new File(Objects.requireNonNull(classLoader.getResource("serviceAccountKey.json")).getFile());

        InputStream serviceAccount = new FileInputStream(file.getAbsolutePath());
        FirebaseOptions options = new FirebaseOptions.Builder().setCredentials(GoogleCredentials.fromStream(serviceAccount)).build();

        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }

        SpringApplication.run(ThymeleafApplication.class, args);
    }
}