//package com.Nirmitee.Abhyasika.ServiceV1;
//
//import com.Nirmitee.Abhyasika.ModelV1.AbhyasikaUser;
//import com.Nirmitee.Abhyasika.ModelV1.Project;
//import com.Nirmitee.Abhyasika.ModelV1.ProjectDTO;
//import com.Nirmitee.Abhyasika.RepositoryV1.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//
//@Service
//public class UserService {
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private AuthenticationManager authManager;
//
//    @Autowired
//    private JWTService jwtService;
//
//    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
//
//    public AbhyasikaUser register(AbhyasikaUser user){
//        user.setPassword(encoder.encode(user.getPassword()));
//        return userRepository.save(user);
//    }
//
//    public String verify(AbhyasikaUser user) {
//        Authentication authentication  =authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(),user.getPassword()));
//        if(authentication.isAuthenticated()){
//            return jwtService.generateToken(user.getUsername());
//        }
//        return "Failure";
//    }
//
//    public AbhyasikaUser addProjectToUser(Project project, String token) {
//        String username = jwtService.extractUsername(token);
//        AbhyasikaUser user = userRepository.findByUsername(username);
//        if(user.getProjectList()==null){
//            user.setProjectList(new ArrayList<>());
//        }
//        ProjectDTO projectDTO = new ProjectDTO(project.getPid(), project.getName());
//        user.getProjectList().add(projectDTO);
//        userRepository.save(user);
//        return user;
//    }
//}
