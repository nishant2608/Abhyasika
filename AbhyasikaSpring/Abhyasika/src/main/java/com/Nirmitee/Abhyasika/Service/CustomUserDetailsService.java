package com.Nirmitee.Abhyasika.Service;

import com.Nirmitee.Abhyasika.Model.AbhyasikaUser;
import com.Nirmitee.Abhyasika.Model.UserPrincipal;
import com.Nirmitee.Abhyasika.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AbhyasikaUser user = userRepository.findByUsername(username);
        if(user == null){
            throw new UsernameNotFoundException("User not Found");
        }

        return new UserPrincipal(user);
    }
}
