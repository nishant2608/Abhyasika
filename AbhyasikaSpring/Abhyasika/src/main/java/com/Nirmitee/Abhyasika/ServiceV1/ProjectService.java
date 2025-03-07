//package com.Nirmitee.Abhyasika.ServiceV1;
//
//import com.Nirmitee.Abhyasika.ModelV1.*;
//import com.Nirmitee.Abhyasika.RepositoryV1.ProjectRepository;
//import com.Nirmitee.Abhyasika.RepositoryV1.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//
//@Service
//public class ProjectService {
//    @Autowired
//    private ProjectRepository projectRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private JWTService jwtService;
//
//    public List<Project> getAllProjects(){
//       return projectRepository.findAll();
//    }
//
//    public List<ProjectDTO> getAllProjectList(){
//        List<ProjectDTO> projectList = new ArrayList<>();
//        List<Project> projects= projectRepository.findAll();
//        for(Project project : projects){
//            ProjectDTO dto = new ProjectDTO(project.getPid(),project.getName());
//            projectList.add(dto);
//        }
//        return projectList;
//    }
//
//    public List<ProjectDTO> searchProjectsByName(String query) {
//        List<ProjectDTO> projectList = new ArrayList<>();
//        List<Project> projects = projectRepository.findByNameContaining(query);
//        for(Project project : projects){
//            ProjectDTO dto = new ProjectDTO(project.getPid(),project.getName());
//            projectList.add(dto);
//        }
//        return projectList;
//    }
//
//    public List<ProjectDTO> getProjectsByUser(String token){
//        List<ProjectDTO> projectList = new ArrayList<>();
//        String username = jwtService.extractUsername(token);
//        AbhyasikaUser user = userRepository.findByUsername(username);
//        if(user!=null){
//            return user.getProjectList();
//        }
//        return null;
//    }
//
//    public Optional<Project> getProjectById(String Id){
//        return projectRepository.findById(Id);
//    }
//
//    public List<Chapter> getChaptersByProjectId(String projectId) {
//        Optional<Project> project = projectRepository.findById(projectId);
//        return project.map(Project::getChapters).orElse(null);
//    }
//
//    public List<ChapterDTO> getChapterList(String projectId){
//        List<ChapterDTO> chapterList = new ArrayList<>();
//        Optional<Project> project = projectRepository.findById(projectId);
//        if(project.isPresent()){
//            List<Chapter> chapters = project.get().getChapters();
//            for(Chapter chapter : chapters){
//                ChapterDTO dto = new ChapterDTO(chapter.getCid(),chapter.getName());
//                chapterList.add(dto);
//            }
//            return chapterList;
//        }
//        return null;
//    }
//
//    public Chapter getChapterById(String projectId, String chapterId){
//        Optional<Project> project = projectRepository.findById(projectId);
//        if (project.isPresent()) {
//            List<Chapter> chapters = project.get().getChapters();
//            for (Chapter chapter : chapters) {
//                if (chapter.getCid().equals(chapterId)) {
//                    return chapter;
//                }
//            }
//        }
//        return null;
//    }
//
//
//    public List<Topic> getTopicsByChapterId(String projectId, String chapterId) {
//        Optional<Project> project = projectRepository.findById(projectId);
//        if (project.isPresent()) {
//            List<Chapter> chapters = project.get().getChapters();
//            for (Chapter chapter : chapters) {
//                if (chapter.getCid().equals(chapterId)) {
//                    return chapter.getTopics();
//                }
//            }
//        }
//        return null; // or throw an exception, or return an empty list
//    }
//
//    public List<QuizDTO> getQuizzesByChapterId(String projectId, String chapterId){
//        Optional<Project> project = projectRepository.findById(projectId);
//        List<QuizDTO> quizList = new ArrayList<>();
//        if (project.isPresent()) {
//            List<Chapter> chapters = project.get().getChapters();
//            for (Chapter chapter : chapters) {
//                if (chapter.getCid().equals(chapterId)) {
//                    List<Quiz> quizzes = chapter.getQuizzes();
//                    for(Quiz quiz : quizzes){
//                        quizList.add(new QuizDTO(quiz.getQid(),quiz.getName()));
//                    }
//                    return quizList;
//                }
//            }
//        }
//        return null;
//    }
//
//    public QuizQ getQuizById(String projectId, String chapterId, String quizId){
//        Optional<Project> project = projectRepository.findById(projectId);
//        List<QuestionDTO> questionDTOList = new ArrayList<>();
//        if (project.isPresent()) {
//            List<Chapter> chapters = project.get().getChapters();
//            for (Chapter chapter : chapters) {
//                if (chapter.getCid().equals(chapterId)) {
//                    List<Quiz> quizzes = chapter.getQuizzes();
//                    for(Quiz quiz : quizzes){
//                        if(quiz.getQid().equals(quizId)){
//                            List<Question> questions = quiz.getQuestions();
//                            for(Question question : questions) {
//                                questionDTOList.add(new QuestionDTO(question.getQuestion(), question.getOptions()));
//                            }
//                            return new QuizQ(quiz.getQid(),quiz.getName(),questionDTOList);
//                        }
//                    }
//                }
//            }
//        }
//        return null;
//    }
//
//    public List<TopicDTO> getTopicList(String projectId, String chapterId){
//        List<TopicDTO> topicList = new ArrayList<>();
//        Optional<Project> project = projectRepository.findById(projectId);
//        if(project.isPresent()){
//            List<Chapter> chapterList = project.get().getChapters();
//            for (Chapter chapter : chapterList) {
//                if (chapter.getCid().equals(chapterId)) {
//                    List<Topic> topics  =chapter.getTopics();
//                    for(Topic topic : topics){
//                        topicList.add(new TopicDTO(topic.getTid(),topic.getName()));
//                    }
//                    return topicList;
//                }
//            }
//        }
//        return null;
//    }
//
//    public Topic getTopicById(String projectId, String chapterId,String topicId){
//        Optional<Project> project = projectRepository.findById(projectId);
//        if (project.isPresent()) {
//            List<Chapter> chapters = project.get().getChapters();
//            for (Chapter chapter : chapters) {
//                if (chapter.getCid().equals(chapterId)) {
//                    List<Topic> topics = chapter.getTopics();
//                    for(Topic topic : topics){
//                        if(topic.getTid().equals(topicId)){
//                            return topic;
//                        }
//                    }
//                }
//            }
//        }
//        return null;
//    }
//
//    public Project createProject(Project project) {
//        if(project.getChapters()!=null){
//            for (Chapter chapter : project.getChapters()) {
//                chapter.setCid(String.valueOf(UUID.randomUUID()));
//                if(chapter.getTopics()!=null){
//                    for (Topic topic : chapter.getTopics()) {
//                        topic.setTid(String.valueOf(UUID.randomUUID()));
//                    }
//                }
//            }
//        }
//        return projectRepository.save(project);
//    }
//
//    public Chapter addChapterToProject(String projectId, Chapter chapter) {
//        Optional<Project> project = projectRepository.findById(projectId);
//        chapter.setCid(String.valueOf(UUID.randomUUID()));
//        if(chapter.getTopics()!=null){
//            for (Topic topic : chapter.getTopics()) {
//                topic.setTid(String.valueOf(UUID.randomUUID()));
//            }
//        }
//        if (project.isPresent()) {
//            if (project.get().getChapters() == null) {
//                project.get().setChapters(new ArrayList<>());
//            }
//            project.get().getChapters().add(chapter);
//            projectRepository.save(project.get());
//            return chapter;
//        }
//        return null; // or throw an exception
//    }
//
//    public Topic addTopicToChapter(String projectId, String chapterId, Topic topic) {
//        Optional<Project> project = projectRepository.findById(projectId);
//        topic.setTid(String.valueOf(UUID.randomUUID()));
//        if (project.isPresent()) {
//            List<Chapter> chapters = project.get().getChapters();
//            if(chapters!=null){
//                for (Chapter chapter : chapters) {
//                    if (chapter.getCid().equals(chapterId)) {
//                        if (chapter.getTopics() == null) {
//                            chapter.setTopics(new ArrayList<>());
//                        }
//                        chapter.getTopics().add(topic);
//                        projectRepository.save(project.get());
//                        return topic;
//                    }
//                }
//            }
//
//        }
//        return null; // or throw an exception
//    }
//
//    public Quiz addQuizToChapter(String projectId, String chapterId, Quiz quiz) {
//        Optional<Project> project = projectRepository.findById(projectId);
//        quiz.setQid(String.valueOf(UUID.randomUUID()));
//        if (project.isPresent()) {
//            List<Chapter> chapters = project.get().getChapters();
//            if (chapters != null) {
//                for (Chapter chapter : chapters) {
//                    if (chapter.getCid().equals(chapterId)) {
//                        if (chapter.getQuizzes() == null) {
//                            chapter.setQuizzes(new ArrayList<>());
//                        }
//                        chapter.getQuizzes().add(quiz);
//                        projectRepository.save(project.get());
//                        return quiz;
//                    }
//                }
//            }
//        }
//        return null;
//    }
//
//    public Topic updateTopicInChapter(String projectId, String chapterId, String topicId, Topic topic) {
//        Optional<Project> project = projectRepository.findById(projectId);
//        topic.setTid(String.valueOf(UUID.randomUUID()));
//        if (project.isPresent()) {
//            List<Chapter> chapters = project.get().getChapters();
//            if(chapters!=null){
//                for (Chapter chapter : chapters) {
//                    if (chapter.getCid().equals(chapterId)) {
//                        List<Topic> topics = chapter.getTopics();
//                        if(topics!=null){
//                            for(Topic topica :topics){
//                                if(topica.getTid().equals(topicId)){
//                                    topica.setName(topic.getName());
//                                    topica.setContent(topic.getContent());
//                                    projectRepository.save(project.get());
//                                    return topic;
//                                }
//                            }
//                        }
//
//                    }
//                }
//            }
//
//        }
//        return null; // or throw an exception
//    }
//
//}
