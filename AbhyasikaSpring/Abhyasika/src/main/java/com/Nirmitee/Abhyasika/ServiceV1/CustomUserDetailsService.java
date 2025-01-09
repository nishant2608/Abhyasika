//package com.Nirmitee.Abhyasika.ServiceV1;
//
//import com.Nirmitee.Abhyasika.ModelV1.AbhyasikaUser;
//import com.Nirmitee.Abhyasika.ModelV1.UserPrincipal;
//import com.Nirmitee.Abhyasika.RepositoryV1.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//@Service
//public class CustomUserDetailsService implements UserDetailsService {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        AbhyasikaUser user = userRepository.findByUsername(username);
//        if(user == null){
//            throw new UsernameNotFoundException("User not Found");
//        }
//
//        return new UserPrincipal(user);
//    }
//}
