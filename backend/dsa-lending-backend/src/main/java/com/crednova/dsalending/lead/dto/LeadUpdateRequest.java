package com.crednova.dsalending.lead.dto;

import com.crednova.dsalending.lead.entity.LeadSource;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;

public class LeadUpdateRequest {
    private String customerName;
    @Pattern(regexp = "^[0-9]{10}$", message = "must be 10 digits")
    private String mobile;
    @Email
    private String email;
    private LeadSource source;
    private String city;
    private String state;

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public LeadSource getSource() { return source; }
    public void setSource(LeadSource source) { this.source = source; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
}
