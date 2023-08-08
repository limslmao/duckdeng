package com.duckdeng.orderstat.lim.controller;

import com.duckdeng.orderstat.lim.model.CRUD;
import com.duckdeng.orderstat.lim.service.CRUDService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
public class CRUDController {

    public CRUDService crudService;

    public CRUDController(CRUDService crudService) {
        this.crudService = crudService;
    }

    @PostMapping("/create")
    public String createCRUD(@RequestBody CRUD crud) throws ExecutionException, InterruptedException {
        return crudService.createCRUD(crud);
    }

    @GetMapping("/get")
    public CRUD getCRUD(@RequestParam String documentId) throws ExecutionException, InterruptedException {
        return crudService.getCRUD(documentId);
    }

    @PutMapping("/update")
    public String updateCRUD(@RequestBody CRUD crud) throws ExecutionException, InterruptedException {
        return crudService.updateCRUD(crud);
    }

    @PutMapping("/delete")
    public String updateCRUD(@RequestParam String documentId) {
        return crudService.deleteCRUD(documentId);
    }

    @GetMapping("/test")
    public ResponseEntity<String> testGetEndPoint() {
        return ResponseEntity.ok("Test ok");
    }

}
