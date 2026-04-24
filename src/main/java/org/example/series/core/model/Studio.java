package org.example.series.core.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
/**
 * JPA entity representing a studio.
 */
@Entity
@Table(
        name = "studios",
        uniqueConstraints = @UniqueConstraint(columnNames = "name")
)
public class Studio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String country;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "studio")
    private List<Series> series;

    public Studio() {}

    public Studio(String name, String country) {
        this.name = name;
        this.country = country;
    }

    public Studio(Long id, String name, String country) {
        this.id = id;
        this.name = name;
        this.country = country;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCountry() { return country; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public List<Series> getSeries() { return series; }

    public void setName(String name) { this.name = name; }
    public void setCountry(String country) { this.country = country; }
}