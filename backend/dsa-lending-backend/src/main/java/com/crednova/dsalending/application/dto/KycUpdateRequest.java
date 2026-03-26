package com.crednova.dsalending.application.dto;

public class KycUpdateRequest {
    private String panNumber;
    private String ckycNumber;

    public String getPanNumber() { return panNumber; }
    public void setPanNumber(String panNumber) { this.panNumber = panNumber; }
    public String getCkycNumber() { return ckycNumber; }
    public void setCkycNumber(String ckycNumber) { this.ckycNumber = ckycNumber; }
}
