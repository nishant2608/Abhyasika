//package com.Nirmitee.Abhyasika.ControllerV1;
//
//import com.Nirmitee.Abhyasika.ModelV1.AbhyasikaUser;
//import com.Nirmitee.Abhyasika.ServiceV1.UserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
//public class UserController {
//
//    @Autowired
//    UserService userService;
//
//    @PostMapping("/register")
//    public AbhyasikaUser register(@RequestBody AbhyasikaUser user){
//        return userService.register(user);
//    }
//
//    @PostMapping("/login")
//    public String login(@RequestBody AbhyasikaUser user){
//        return userService.verify(user);
//    }
//}
