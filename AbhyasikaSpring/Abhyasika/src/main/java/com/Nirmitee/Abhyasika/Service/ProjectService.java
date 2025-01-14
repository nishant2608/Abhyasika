package com.Nirmitee.Abhyasika.Service;

import com.Nirmitee.Abhyasika.Model.AbhyasikaUser;
import com.Nirmitee.Abhyasika.Model.Project;
import com.Nirmitee.Abhyasika.Model.ProjectDTO;
import com.Nirmitee.Abhyasika.Model.UserDTO;
import com.Nirmitee.Abhyasika.Repository.ProjectRepository;
import com.Nirmitee.Abhyasika.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private UserService userService;

//    public List<Project> getAllProjects(){
//       return projectRepository.findAll();
//    }

    public List<ProjectDTO> getAllPublicProjects(){
        List<Project> projectList = projectRepository.findByIsPublicTrue();
        List<ProjectDTO> dtoList = new ArrayList<>();
        for(Project project: projectList){
            ProjectDTO projectDTO = new ProjectDTO(project.getPid(), project.getName());
            dtoList.add(projectDTO);
        }
        return dtoList;
    }

    public Project createProject(Project project, String token) {
        String username = jwtService.extractUsername(token);
        AbhyasikaUser user = userRepository.findByUsername(username);
        UserDTO owner = new UserDTO( user.getName(),user.getUsername());
        project.setOwner(owner);


        return projectRepository.save(project);
    }

    public Project findById(String pid) {
        return projectRepository.findByPid(pid);
    }

    public Project updateProject(Project existingProject) {
        return projectRepository.save(existingProject);
    }
}
