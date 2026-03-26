package com.crednova.dsalending.lead.dto;

import com.crednova.dsalending.lead.entity.LeadSource;
import com.crednova.dsalending.lead.entity.LoanType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;

public class LeadCreateRequest {
    @NotBlank
    private String customerName;
    @NotBlank
    @Pattern(regexp = "^[0-9]{10}$", message = "must be 10 digits")
    private String mobile;
    @Email
    private String email;
    @NotNull
    private LoanType loanType;
    @NotNull
    @DecimalMin(value = "1")
    private BigDecimal loanAmount;
    @NotNull
    private LeadSource source;
    @NotBlank
    private String city;
    @NotBlank
    private String state;
    private String dsaName;
    private String agentName;

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public LoanType getLoanType() { return loanType; }
    public void setLoanType(LoanType loanType) { this.loanType = loanType; }
    public BigDecimal getLoanAmount() { return loanAmount; }
    public void setLoanAmount(BigDecimal loanAmount) { this.loanAmount = loanAmount; }
    public LeadSource getSource() { return source; }
    public void setSource(LeadSource source) { this.source = source; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getDsaName() { return dsaName; }
    public void setDsaName(String dsaName) { this.dsaName = dsaName; }
    public String getAgentName() { return agentName; }
    public void setAgentName(String agentName) { this.agentName = agentName; }
}
