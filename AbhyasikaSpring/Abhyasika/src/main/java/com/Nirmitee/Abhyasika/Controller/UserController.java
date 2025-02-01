package com.Nirmitee.Abhyasika.Controller;

import com.Nirmitee.Abhyasika.Model.AbhyasikaUser;
import com.Nirmitee.Abhyasika.Model.UserQuery;
import com.Nirmitee.Abhyasika.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping("/register")
    public AbhyasikaUser register(@RequestBody AbhyasikaUser user){
        return userService.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody AbhyasikaUser user){
        return userService.verify(user);
    }

    @GetMapping("/user/find/{username}")
    public UserQuery getUser(@PathVariable String username){
        return userService.findIndividual(username);
    }

    @GetMapping("/user/query")
    public List<UserQuery> getUsers(@RequestParam(required = false) String username){
        if (username != null && !username.isEmpty()) {
            return userService.searchUsersByUsername(username);
        } else {
            return null;
        }
    }

    @GetMapping("/user/verify")
    public ResponseEntity<?> verifyUser(HttpServletRequest request) {
        String authtoken = request.getHeader("Authorization");
        String token = authtoken.substring(7);
        return ResponseEntity.ok(userService.verifyUser(token));
    }
}
