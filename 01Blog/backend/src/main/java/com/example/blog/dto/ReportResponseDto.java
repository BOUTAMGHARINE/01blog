package com.example.blog.dto;

import java.time.LocalDateTime;

import com.example.blog.entities.Report;
import com.example.blog.entities.User;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReportResponseDto {
    private Long id;
    private Long reporterId;
    private Long reportedProfileId;
    private UserSummaryDto reporter;
    private UserSummaryDto reportedProfile;
    private String reason;
    private LocalDateTime timestamp;

    public static ReportResponseDto from(Report report, User reporter, User reportedProfile) {
        return new ReportResponseDto(
                report.getId(),
                report.getReporterId(),
                report.getReportedProfileId(),
                reporter != null ? UserSummaryDto.from(reporter) : null,
                reportedProfile != null ? UserSummaryDto.from(reportedProfile) : null,
                report.getReason(),
                report.getTimestamp());
    }
}
