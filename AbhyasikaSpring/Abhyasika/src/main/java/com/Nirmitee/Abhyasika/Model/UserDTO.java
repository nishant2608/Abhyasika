package com.Nirmitee.Abhyasika.Model;

public class UserDTO {
    private String name;
    private String username;

    public UserDTO(String name, String username) {
        this.name = name;
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String name) {
        this.username = name;
    }
}
