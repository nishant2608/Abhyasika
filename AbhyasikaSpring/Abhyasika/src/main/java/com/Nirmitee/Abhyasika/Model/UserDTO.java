package com.Nirmitee.Abhyasika.Model;

public class UserDTO {
    private String uid;
    private String username;

    public UserDTO(String uid, String username) {
        this.uid = uid;
        this.username = username;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String name) {
        this.username = name;
    }
}
