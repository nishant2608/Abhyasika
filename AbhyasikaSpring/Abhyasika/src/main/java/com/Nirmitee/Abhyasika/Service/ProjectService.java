package com.Nirmitee.Abhyasika.Service;

import com.Nirmitee.Abhyasika.Exception.NoAccessException;
import com.Nirmitee.Abhyasika.Exception.NotFound;
import com.Nirmitee.Abhyasika.Model.*;
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

    public ProjectResponse getProjectById(String token, String pid){
        String username = jwtService.extractUsername(token);
        AbhyasikaUser user = userService.findByUsername(username);
        Project project = projectRepository.findByPid(pid);
        if(project==null){
            throw new NotFound("Project not found");
        }
        boolean isOwner = false;
        boolean hasViewPermission = false;
        boolean hasEditPermission = false;
        boolean hasEditAccess = false;

        if (user.getOwnedProjects()!=null){
            isOwner = user.getOwnedProjects().stream().anyMatch(p -> p.getPid().equals(pid));
            if(isOwner){
                isOwner = project.getOwner().getUsername().equals(username);
                hasEditAccess = true;
            }
        }

        if(user.getViewedProjects()!=null){
            hasViewPermission = user.getViewedProjects().stream().anyMatch(p -> p.getPid().equals(pid));
            if(hasViewPermission) {
                hasViewPermission = project.getViewers().stream().anyMatch(u -> u.getUsername().equals(username));
            }
        }

        if(user.getEditedProjects()!=null){
            hasEditPermission = user.getEditedProjects().stream().anyMatch(p -> p.getPid().equals(pid));
            if(hasEditPermission){
                hasEditPermission = project.getEditors().stream().anyMatch(u -> u.getUsername().equals(username));
                hasEditAccess = true;
            }
        }

        if(project.isPublic() || isOwner || hasViewPermission || hasEditPermission){
            return new ProjectResponse(project, hasEditAccess);
        }
        else{
            throw new NoAccessException("User does not have access");
        }
    }

    public Project findById(String pid) {
        return projectRepository.findByPid(pid);
    }

    public Project editProject(Project project, String token, String pid){
      try {
          ProjectResponse projectResponse = getProjectById(token, pid);
          if (projectResponse.isEditAccess()) {
              Project existingProject = projectResponse.getProject();
              existingProject.setName(project.getName());
              existingProject.setDescription(project.getDescription());
              projectRepository.save(existingProject);
                return existingProject;
          } else {
              throw new NoAccessException("No Edit Access");
          }
      }
      catch(NotFound e){
          throw new NotFound("Project not found");
      }
      catch(NoAccessException e){
          throw new NoAccessException("No Access for the project");
      }

    }

    public Project updateProject(Project existingProject) {
        return projectRepository.save(existingProject);
    }

    public Project updatePublic(Project p, String token, String pid) {
        String username = jwtService.extractUsername(token);
        AbhyasikaUser user = userService.findByUsername(username);
        Project project = projectRepository.findByPid(pid);
        if(project==null){
            throw new NotFound("Project not found");
        }
        if(project.getOwner().getUsername().equals(username)){
            project.setPublic(p.isPublic());
            return projectRepository.save(project);
        }
        else{
            throw new NoAccessException("User does not have access");
        }
    }

    public void addChapterToProject(String pid, ChapterDTO chapterDTO){
        Project project = projectRepository.findByPid(pid);
        List<ChapterDTO> chapters = project.getChapters();
        chapters.add(chapterDTO);
        project.setChapters(chapters);
        projectRepository.save(project);
    }
}
