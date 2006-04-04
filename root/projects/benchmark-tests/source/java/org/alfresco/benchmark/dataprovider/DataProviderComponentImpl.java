/*
 * Copyright (C) 2005 Alfresco, Inc.
 *
 * Licensed under the Mozilla Public License version 1.1 
 * with a permitted attribution clause. You may obtain a
 * copy of the License at
 *
 *   http://www.alfresco.org/legal/license.txt
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the
 * License.
 */
package org.alfresco.benchmark.dataprovider;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.alfresco.benchmark.dataprovider.PropertyProfile.PropertyRestriction;
import org.alfresco.benchmark.util.RandUtils;
import org.alfresco.repo.content.MimetypeMap;

/**
 * @author Roy Wetherall
 */

public class DataProviderComponentImpl implements DataProviderComponent
{   
    /** The locations of the content data */
    private String[] dataLocations;
    
    /** Mimetype map */
    private MimetypeMap mimetypeMap;
    
    /** Content cache */
    private List<ContentData> contentCache; 
    
    /**
     * Set the data locations
     * 
     * @param dataLocations     the data location
     */
    public void setDataLocations(String[] dataLocations)
    {
        this.dataLocations = dataLocations;
    }
    
    /**
     * Set the mime type map
     * 
     * @param mimetypeMap   the mime type map
     */
    public void setMimetypeMap(MimetypeMap mimetypeMap)
    {
        this.mimetypeMap = mimetypeMap;
    }
    
    /**
     * Bean initialisation 
     */
    public void init()
    {
        // Load the content details into the cache
        cacheContentData();
    }
    
    /**
     * Cache the content data
     */
    private void cacheContentData()
    {
        this.contentCache = new ArrayList<ContentData>();
        for (String dataLocation : this.dataLocations)
        {
            cacheContentData(dataLocation); 
        }        
    }
    
    /**
     * Cache the content data
     * 
     * @param locations     the content data locations
     */
    private void cacheContentData(String location)
    {
        File folder = new File(location);
        if (folder == null)
        {
            throw new RuntimeException("Unable to find folder at location " + location);
        }
        
        for (File file : folder.listFiles())
        {
            if (file.isDirectory() == true)
            {
                if (file.getName().contains("svn") == false)
                {
                    cacheContentData(file.getPath());
                }
            }
            else
            {
                String mimetype = this.mimetypeMap.guessMimetype(file.getName());
                String extension = this.mimetypeMap.getExtension(mimetype);
                ContentData contentData = new ContentData(file.getPath(),
                                                          mimetype,
                                                          "UTF-8",
                                                          (int)file.length(),
                                                          extension);
                
                this.contentCache.add(contentData);
            }
        }
    }
    
    /**
     * @see org.alfresco.benchmark.dataprovider.DataProviderComponent#getPropertyData(org.alfresco.benchmark.dataprovider.RepositoryProfile, java.util.List)
     */
    public Map<String, Object> getPropertyData(
            RepositoryProfile repositoryProfile,
            List<PropertyProfile> propertyProfiles)
    {
        // TODO need to consider the repository profile ??
        Map<String, Object> result = new HashMap<String, Object>();
        
        for (PropertyProfile propertyProfile : propertyProfiles)
        {
            Object value = null;
            
            switch (propertyProfile.getPropertyType())
            {
                case TEXT:
                {
                    value = getTextPropertyData(propertyProfile);                    
                    break;
                }
                case CONTENT:
                {
                    value = getContentPropertyData(propertyProfile);
                    break;
                }
                default:
                {
                    throw new RuntimeException("Property type not supported.  Yet!!");
                }
            }
            
            result.put(propertyProfile.getPropertyName(), value);
        }
        
        return result;        
    }
    
    private ContentData getContentPropertyData(PropertyProfile propertyProfile)
    {
        int randPos = RandUtils.rand.nextInt(this.contentCache.size());
        return this.contentCache.get(randPos);
    }
    
    private String getTextPropertyData(PropertyProfile propertyProfile)
    {
        int minLength = 5;
        Object minLengthValue = propertyProfile.getRestriction(PropertyRestriction.MIN_LENGTH);
        if (minLengthValue != null)
        {
            minLength = ((Integer)minLengthValue).intValue();
        }
        
        int maxLength = 35;
        Object maxLengthValue = propertyProfile.getRestriction(PropertyRestriction.MAX_LENGTH);
        if (maxLengthValue != null)
        {
            maxLength = ((Integer)maxLengthValue).intValue();
        }
        
        int randSize = RandUtils.rand.nextInt(maxLength-minLength+1);
        StringBuilder builder = new StringBuilder(minLength+randSize);
        for (int i = 0; i < minLength+randSize; i++)
        {
            builder.append(generateRandomChar());
        }
        return builder.toString();
    }
    
    private char generateRandomChar()
    {
        char result = ' ';
        
        // Dermine whether we want puncuation or alphabet
        int randCharType = RandUtils.rand.nextInt(100);
        if (randCharType >= 18)
        {
            // Its a normal alphabetic character
            int randAlpa = RandUtils.rand.nextInt(this.alphabet.length);
            result = this.alphabet[randAlpa];
            
            int randToUpper = RandUtils.rand.nextInt(100);
            if (randToUpper < 3)
            {
                result = Character.toUpperCase(result);
            }
        }
        
        // else the char returned will be a space
        
        return result;
    }
    
    private char[] alphabet = new char[] {'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'};

}
