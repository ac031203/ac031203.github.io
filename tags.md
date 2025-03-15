---
title: "Tags"
layout: archive
author_profile: true
permalink: /tags/
---

{% include group-by-array collection=site.posts field="tags" %}

{% for tag in group_names %}
  {% assign posts = group_items[forloop.index0] %}
  <h2 id="{{ tag | slugify }}" class="archive__subtitle">{{ tag }}</h2>
  <div class="entries-{{ page.entries_layout | default: 'list' }}">
    {% for post in posts %}
      {% include archive-single.html %}
    {% endfor %}
  </div>
{% endfor %}