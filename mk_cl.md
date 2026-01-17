I have a file called all.md that contains multiple math problem entries, each identified by a header "### File: [filename].md".

Please perform a comprehensive, fine-grained clustering of all problems found in the file based on their mathematical methodology. Follow these instructions strictly:

1. **Dynamic Discovery**: Do not assume the number of files. Scan the entire all.md file to discover and extract every unique filename associated with a "### File:" header. List every single file found; do not truncate the list.

2. **Fine-Grained Multi-Level Clustering**: 
   - Group the files into broad methodology clusters
   - Within each cluster, create sub-clusters based on problem type
   - Within each sub-cluster, create method-based sub-sub-clusters showing the specific approaches used to solve problems
   - For True/False problems, group them together in subclusters (do not separate True from False)

3. **Cluster Statistics**: Include the total number of files contained within each main cluster, sub-cluster, and method-based sub-sub-cluster.

4. **Descriptions**: 
   - For each method-based sub-sub-cluster, provide ONE full, detailed description of a typical file as an example, explaining the problem AND the solution method in detail
   - For all other files in that method cluster, provide a brief one-sentence description of the specific problem or claim
   - Always indicate the conclusion (True/False/numerical result) for each file

5. **Complete Linking**: For every single file, provide a link in the format: [filename.md](https://github.com/igorratn/coyote-math/blob/main/filename.md)
   - Show the filename/link only ONCE (do not repeat the filename before the link)

6. **Special Cluster**: Create a separate dedicated cluster specifically for spherical harmonics problems (check carefully for all files mentioning spherical harmonics, Y_lm, associated Legendre functions, or Theta_lm)

7. **Formatting**: Use clear markdown hierarchy with ## for main clusters, ### for sub-clusters, #### for method-based groupings

8. **Final Summary**: Provide complete statistics showing:
   - Total number of files discovered
   - Breakdown by main cluster
   - Breakdown by sub-cluster
   - Breakdown by method (where applicable)