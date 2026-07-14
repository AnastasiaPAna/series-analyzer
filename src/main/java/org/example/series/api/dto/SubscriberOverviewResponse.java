package org.example.series.api.dto;

import java.util.List;

public class SubscriberOverviewResponse {

    private long totalSubscribers;
    private long activeSubscribers;
    private long newSeriesSubscribers;
    private long newSeasonSubscribers;
    private List<SubscriberProfileResponse> subscribers;

    public SubscriberOverviewResponse(long totalSubscribers,
                                      long activeSubscribers,
                                      long newSeriesSubscribers,
                                      long newSeasonSubscribers,
                                      List<SubscriberProfileResponse> subscribers) {
        this.totalSubscribers = totalSubscribers;
        this.activeSubscribers = activeSubscribers;
        this.newSeriesSubscribers = newSeriesSubscribers;
        this.newSeasonSubscribers = newSeasonSubscribers;
        this.subscribers = subscribers;
    }

    public long getTotalSubscribers() {
        return totalSubscribers;
    }

    public long getActiveSubscribers() {
        return activeSubscribers;
    }

    public long getNewSeriesSubscribers() {
        return newSeriesSubscribers;
    }

    public long getNewSeasonSubscribers() {
        return newSeasonSubscribers;
    }

    public List<SubscriberProfileResponse> getSubscribers() {
        return subscribers;
    }
}
