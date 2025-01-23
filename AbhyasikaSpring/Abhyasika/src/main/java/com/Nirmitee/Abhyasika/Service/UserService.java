package com.Nirmitee.Abhyasika.Service;

import com.Nirmitee.Abhyasika.Model.AbhyasikaUser;
import com.Nirmitee.Abhyasika.Model.Project;
import com.Nirmitee.Abhyasika.Model.ProjectDTO;
import com.Nirmitee.Abhyasika.Model.UserQuery;
import com.Nirmitee.Abhyasika.Repository.ProjectRepository;
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

    @Autowired
    private ProjectRepository projectRepository;


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
        ProjectDTO projectDTO = new ProjectDTO(project.getPid());
        user.getOwnedProjects().add(projectDTO);
        userRepository.save(user);
    }

    public void addViewProjectToUser(Project project, String username){
        AbhyasikaUser user = userRepository.findByUsername(username);
        if(user.getViewedProjects()==null){
            user.setViewedProjects(new ArrayList<>());
        }
        ProjectDTO projectDTO = new ProjectDTO(project.getPid());
        user.getViewedProjects().add(projectDTO);
        userRepository.save(user);
    }

    public void addEditProjectToUser(Project project, String username){
        AbhyasikaUser user = userRepository.findByUsername(username);
        if(user.getEditedProjects()==null){
            user.setEditedProjects(new ArrayList<>());
        }
        ProjectDTO projectDTO = new ProjectDTO(project.getPid());
        user.getEditedProjects().add(projectDTO);
        userRepository.save(user);
    }

    public List<Project> getProjectsByUser(String token) {
        String username = jwtService.extractUsername(token);
        AbhyasikaUser user = userRepository.findByUsername(username);
        List<ProjectDTO> projectDTOList = user.getOwnedProjects();
        if(projectDTOList==null){
            return new ArrayList<>();
        }
        List<Project> projectList = new ArrayList<>();
        for(ProjectDTO projectDTO: projectDTOList){
            Project project = projectRepository.findByPid(projectDTO.getPid());
            projectList.add(project);
        }
        return projectList;
    }

    public List<Project> getViewProjectsByUser(String token) {
        String username = jwtService.extractUsername(token);
        AbhyasikaUser user = userRepository.findByUsername(username);
        List<ProjectDTO> dtoList = user.getViewedProjects();
        if(dtoList==null){
            return new ArrayList<>();
        }
        List<Project> projectList = new ArrayList<>();
        for (ProjectDTO projectDTO: dtoList){
            Project project = projectRepository.findByPid(projectDTO.getPid());
            projectList.add(project);
        }
        return projectList;
    }

    public List<Project> getEditProjectsByUser(String token) {
        String username = jwtService.extractUsername(token);
        AbhyasikaUser user = userRepository.findByUsername(username);
        List<ProjectDTO> dtoList = user.getEditedProjects();
        if(dtoList==null){
            return new ArrayList<>();
        }
        List<Project> projectList = new ArrayList<>();
        for (ProjectDTO projectDTO: dtoList){
            Project project = projectRepository.findByPid(projectDTO.getPid());
            projectList.add(project);
        }
        return projectList;
    }

    public AbhyasikaUser findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void removeViewProjectFromUser(Project existingProject, String username) {
        AbhyasikaUser user = userRepository.findByUsername(username);
        if(user.getViewedProjects()!=null){
            user.getViewedProjects().removeIf(p -> p.getPid().equals(existingProject.getPid()));
            userRepository.save(user);
        }
    }

    public void removeEditProjectFromUser(Project existingProject, String username) {
        AbhyasikaUser user = userRepository.findByUsername(username);
        if(user.getEditedProjects()!=null){
            user.getEditedProjects().removeIf(p -> p.getPid().equals(existingProject.getPid()));
            userRepository.save(user);
        }
    }

    public List<UserQuery> searchUsersByUsername(String username) {
        List<AbhyasikaUser> UserList = userRepository.findByUsernameContaining(username);
        List<UserQuery> UserQueryList = new ArrayList<>();
        for(AbhyasikaUser user: UserList){
            UserQueryList.add(new UserQuery(user.getUsername(),user.getName(),user.getEmail()));
        }
        return UserQueryList;
    }

    public UserQuery findIndividual(String username) {
        AbhyasikaUser user = userRepository.findByUsername(username);
        if(user==null){
            return null;
        }
        else{
            return new UserQuery(user.getUsername(),user.getName(),user.getEmail());
        }
    }
}
