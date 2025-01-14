package com.Nirmitee.Abhyasika.Service;

import com.Nirmitee.Abhyasika.Model.AbhyasikaUser;
import com.Nirmitee.Abhyasika.Model.Project;
import com.Nirmitee.Abhyasika.Model.ProjectDTO;
import com.Nirmitee.Abhyasika.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JWTService jwtService;


    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public AbhyasikaUser register(AbhyasikaUser user){
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public String verify(AbhyasikaUser user) {
        Authentication authentication  =authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(),user.getPassword()));
        if(authentication.isAuthenticated()){
            return jwtService.generateToken(user.getUsername());
        }
        return "Failure";
    }

    public void addProjectToUser(Project project, String token) {
        String username = jwtService.extractUsername(token);
        AbhyasikaUser user = userRepository.findByUsername(username);
        if(user.getOwnedProjects()==null){
            user.setOwnedProjects(new ArrayList<>());
        }
        ProjectDTO projectDTO = new ProjectDTO(project.getPid(), project.getName());
        user.getOwnedProjects().add(projectDTO);
        userRepository.save(user);
    }

    public void addViewProjectToUser(Project project, String username){
        AbhyasikaUser user = userRepository.findByUsername(username);
        if(user.getViewedProjects()==null){
            user.setViewedProjects(new ArrayList<>());
        }
        ProjectDTO projectDTO = new ProjectDTO(project.getPid(), project.getName());
        user.getViewedProjects().add(projectDTO);
        userRepository.save(user);
    }

    public void addEditProjectToUser(Project project, String username){
        AbhyasikaUser user = userRepository.findByUsername(username);
        if(user.getEditedProjects()==null){
            user.setEditedProjects(new ArrayList<>());
        }
        ProjectDTO projectDTO = new ProjectDTO(project.getPid(), project.getName());
        user.getEditedProjects().add(projectDTO);
        userRepository.save(user);
    }

    public List<ProjectDTO> getProjectsByUser(String token) {
        String username = jwtService.extractUsername(token);
        AbhyasikaUser user = userRepository.findByUsername(username);
        return user.getOwnedProjects();
    }

    public List<ProjectDTO> getViewProjectsByUser(String token) {
        String username = jwtService.extractUsername(token);
        AbhyasikaUser user = userRepository.findByUsername(username);
        return user.getViewedProjects();
    }

    public List<ProjectDTO> getEditProjectsByUser(String token) {
        String username = jwtService.extractUsername(token);
        AbhyasikaUser user = userRepository.findByUsername(username);
        return user.getEditedProjects();
    }

    public AbhyasikaUser findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
